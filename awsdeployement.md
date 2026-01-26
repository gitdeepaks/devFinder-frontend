# AWS Ubuntu Deployment Guide for DevFinder Frontend

This guide will help you deploy the DevFinder frontend application to an AWS Ubuntu instance.

## Prerequisites

- AWS EC2 Ubuntu instance (Ubuntu 20.04 LTS or later recommended)
- SSH access to your instance
- Domain name (optional, for SSL setup)
- Basic knowledge of Linux commands

## Step 1: Connect to Your Ubuntu Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-instance-ip
```

## Step 2: Update System Packages

```bash
sudo apt update
sudo apt upgrade -y
```

## Step 3: Install Bun

```bash
# Install bun (fast JavaScript runtime and package manager)
curl -fsSL https://bun.sh/install | bash

# Reload shell configuration
source ~/.bashrc

# Verify installation
bun --version

# Note: Bun includes Node.js compatibility, so you don't need to install Node.js separately
# Bun is significantly faster than npm for installing dependencies and running scripts
```

## Step 4: Install Nginx

```bash
sudo apt install nginx -y

# Start and enable nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check nginx status
sudo systemctl status nginx
```

## Step 5: Install Git

```bash
sudo apt install git -y
```

## Step 6: Clone Your Repository

```bash
# Navigate to web directory
cd /var/www

# Clone your repository (replace with your actual repo URL)
sudo git clone https://github.com/your-username/devFinder-frontend.git

# Set proper permissions
sudo chown -R $USER:$USER /var/www/devFinder-frontend
cd devFinder-frontend
```

**Note:** If using a private repository, set up SSH keys or use a personal access token.

## Step 7: Install Project Dependencies

```bash
# Install dependencies using bun
bun install

# Verify installation
bun --version
```

## Step 8: Configure Environment Variables

```bash
# Create .env.production file
nano .env.production
```

Add your production environment variables:

```env
VITE_BASE_URL=https://your-backend-api-url.com
```

**Note:** Make sure to update `src/utils/contstants.js` if needed, or use environment variables.

## Step 9: Build the Application

```bash
# Build for production using bun
bun run build

# The build output will be in the 'dist' directory
ls -la dist/
```

## Step 10: Configure Nginx

```bash
# Create nginx configuration file
sudo nano /etc/nginx/sites-available/devfinder-frontend
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Replace with your domain or use _ for all domains

    root /var/www/devFinder-frontend/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Handle React Router (SPA routing)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
}
```

Enable the site:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/devfinder-frontend /etc/nginx/sites-enabled/

# Remove default nginx site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

## Step 11: Configure Firewall

```bash
# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'
# Or separately:
# sudo ufw allow 'Nginx HTTP'
# sudo ufw allow 'Nginx HTTPS'

# Enable firewall
sudo ufw enable

# Check firewall status
sudo ufw status
```

## Step 12: Set Up SSL with Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate (replace with your domain)
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Certbot will automatically configure nginx and set up auto-renewal
```

## Step 13: Set Up Auto-Deployment Script (Optional)

Create a deployment script for easy updates:

```bash
# Create deployment script
nano /var/www/devFinder-frontend/deploy.sh
```

Add the following:

```bash
#!/bin/bash

echo "Starting deployment..."

# Navigate to project directory
cd /var/www/devFinder-frontend

# Pull latest changes
git pull origin main

# Install dependencies using bun
bun install

# Build the application
bun run build

# Reload nginx
sudo systemctl reload nginx

echo "Deployment completed!"
```

Make it executable:

```bash
chmod +x /var/www/devFinder-frontend/deploy.sh
```

## Step 14: Set Up Automatic Updates (Optional)

Create a cron job for automatic deployments:

```bash
# Edit crontab
crontab -e

# Add this line to run deployment daily at 2 AM (adjust as needed)
0 2 * * * /var/www/devFinder-frontend/deploy.sh >> /var/log/devfinder-deploy.log 2>&1
```

## Step 15: Verify Deployment

1. Open your browser and navigate to `http://your-ec2-ip` or `https://your-domain.com`
2. Check that the application loads correctly
3. Test all routes and functionality

## Troubleshooting

### Check Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### Check Application Build

```bash
# Verify dist directory exists and has files
ls -la /var/www/devFinder-frontend/dist/

# Check if index.html exists
cat /var/www/devFinder-frontend/dist/index.html
```

### Restart Nginx

```bash
sudo systemctl restart nginx
```

### Check Nginx Configuration

```bash
sudo nginx -t
```

### Check Port 80/443

```bash
# Check if nginx is listening
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
```

## Environment-Specific Configuration

### Update BASE_URL for Production

Make sure to update the `BASE_URL` in `src/utils/contstants.js` or use environment variables:

```javascript
// src/utils/contstants.js
export const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://your-backend-api-url.com';
```

Then rebuild:

```bash
bun run build
```

## Maintenance Commands

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update bun (if needed)
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# Rebuild application
cd /var/www/devFinder-frontend
bun install  # Update dependencies if package.json changed
bun run build
sudo systemctl reload nginx

# Renew SSL certificate (usually automatic)
sudo certbot renew
```

## Security Best Practices

1. **Keep system updated**: Regularly run `sudo apt update && sudo apt upgrade`
2. **Use SSH keys**: Disable password authentication for SSH
3. **Configure firewall**: Only allow necessary ports
4. **Use SSL**: Always use HTTPS in production
5. **Regular backups**: Set up automated backups of your application
6. **Monitor logs**: Regularly check nginx and application logs

## Additional Resources

- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)

## Quick Reference

```bash
# Install dependencies
bun install

# Build application
bun run build

# Test nginx config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

# Restart nginx
sudo systemctl restart nginx

# Check nginx status
sudo systemctl status nginx

# View nginx logs
sudo tail -f /var/log/nginx/error.log

# Check bun version
bun --version
```
