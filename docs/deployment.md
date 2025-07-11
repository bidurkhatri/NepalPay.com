# NepaliPay Production Deployment Guide

## Prerequisites

### Environment Variables
Create a `.env` file with the following production configurations:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database
PGHOST=your-postgres-host
PGPORT=5432
PGUSER=your-postgres-user
PGPASSWORD=your-postgres-password
PGDATABASE=nepalipay_production

# Blockchain Configuration (Required for full functionality)
BSC_RPC_URL=https://bsc-dataseed1.binance.org/
NEPALIPAY_CONTRACT_ADDRESS=0x742d35Cc8e6F3b3F4b2e8F8aD35a3f6B8e9a0b7C
ADMIN_PRIVATE_KEY=your-admin-wallet-private-key

# Security Configuration
WALLET_ENCRYPTION_SECRET=your-secure-32-byte-encryption-key
SESSION_SECRET=your-session-secret-key

# Payment Integration
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Application Configuration
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-domain.com
```

### Smart Contract Deployment

#### 1. Deploy Smart Contracts to BSC Mainnet

```bash
# Clone the smart contract repository
git clone https://github.com/your-org/nepalipay-contracts
cd nepalipay-contracts

# Install dependencies
npm install

# Configure deployment
cp .env.example .env
# Edit .env with your BSC mainnet configuration

# Deploy contracts
npm run deploy:mainnet

# Verify contracts on BscScan
npm run verify:mainnet
```

#### 2. Update Contract Addresses

After deployment, update your `.env` file with the deployed contract addresses:

```bash
NEPALIPAY_CONTRACT_ADDRESS=0x... # From deployment output
NPT_TOKEN_CONTRACT_ADDRESS=0x... # From deployment output
FEE_RELAYER_CONTRACT_ADDRESS=0x... # From deployment output
```

## Production Deployment Steps

### 1. Database Setup

```sql
-- Create production database
CREATE DATABASE nepalipay_production;

-- Create database user (optional but recommended)
CREATE USER nepalipay_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE nepalipay_production TO nepalipay_user;
```

### 2. Application Deployment

#### Option A: Replit Deployment (Recommended)

1. **Configure Environment Variables**
   - Go to your Replit project settings
   - Add all required environment variables from the list above
   - Ensure `NODE_ENV=production`

2. **Deploy Application**
   ```bash
   # Build the application
   npm run build
   
   # Deploy using Replit's deployment feature
   # Click the "Deploy" button in Replit interface
   ```

3. **Verify Deployment**
   - Check application logs for successful startup
   - Verify database connectivity
   - Test wallet creation functionality
   - Confirm blockchain service connectivity

#### Option B: Manual Server Deployment

1. **Prepare Server**
   ```bash
   # Update system packages
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 20+
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PostgreSQL
   sudo apt-get install -y postgresql postgresql-contrib
   
   # Configure PostgreSQL
   sudo -u postgres createdb nepalipay_production
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/your-org/nepalipay-app
   cd nepalipay-app
   
   # Install dependencies
   npm install
   
   # Build application
   npm run build
   
   # Set up environment variables
   cp .env.example .env
   # Edit .env with production values
   
   # Start application with PM2
   npm install -g pm2
   pm2 start ecosystem.config.js --env production
   pm2 save
   pm2 startup
   ```

### 3. SSL Certificate Setup

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Configure auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 4. Nginx Configuration

Create `/etc/nginx/sites-available/nepalipay`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the configuration:
```bash
sudo ln -s /etc/nginx/sites-available/nepalipay /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Post-Deployment Verification

### 1. Health Check Endpoints

Test these endpoints after deployment:

```bash
# Application health
curl https://your-domain.com/api/health

# Database connectivity
curl https://your-domain.com/api/v1/wallet/status \
  -H "Authorization: Bearer your-test-token"

# Blockchain connectivity
curl https://your-domain.com/api/v1/wallet/status \
  -H "Authorization: Bearer your-test-token"
```

### 2. Wallet Functionality Test

```bash
# Test wallet creation
curl -X POST https://your-domain.com/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "securepassword"
  }'

# Test wallet retrieval
curl https://your-domain.com/api/v1/wallet \
  -H "Authorization: Bearer your-auth-token"
```

### 3. Blockchain Integration Test

```bash
# Test network status
curl https://your-domain.com/api/v1/wallet/status

# Test address validation
curl -X POST https://your-domain.com/api/v1/wallet/validate-address \
  -H "Content-Type: application/json" \
  -d '{"address": "0x742d35Cc8e6F3b3F4b2e8F8aD35a3f6B8e9a0b7C"}'
```

## Monitoring and Maintenance

### 1. Application Monitoring

Set up monitoring for:
- Application uptime and response times
- Database connection health
- Blockchain network connectivity
- Wallet creation success rates
- Transaction processing rates

### 2. Log Management

Configure log rotation and monitoring:

```bash
# Application logs
tail -f /var/log/nepalipay/app.log

# PM2 logs (if using PM2)
pm2 logs nepalipay

# Nginx access logs
tail -f /var/log/nginx/access.log
```

### 3. Database Backups

Set up automated database backups:

```bash
# Create backup script
cat > /etc/cron.daily/nepalipay-backup << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/nepalipay"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump nepalipay_production > $BACKUP_DIR/nepalipay_$DATE.sql
gzip $BACKUP_DIR/nepalipay_$DATE.sql

# Keep only last 30 days of backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
EOF

chmod +x /etc/cron.daily/nepalipay-backup
```

### 4. Security Updates

Regular maintenance tasks:
- Update Node.js and npm packages monthly
- Apply OS security updates weekly
- Rotate encryption keys annually
- Review and update SSL certificates
- Monitor for smart contract vulnerabilities

## Scaling Considerations

### Horizontal Scaling

For high-traffic deployments:

1. **Load Balancer Setup**
   - Use nginx or cloud load balancer
   - Distribute traffic across multiple app instances
   - Configure session stickiness for WebSocket connections

2. **Database Scaling**
   - Set up read replicas for read-heavy operations
   - Implement connection pooling
   - Consider database partitioning for large datasets

3. **Caching Layer**
   - Implement Redis for session storage
   - Cache frequently accessed wallet balances
   - Cache blockchain query results with TTL

### Performance Optimization

1. **Application Level**
   - Enable gzip compression
   - Implement CDN for static assets
   - Optimize database queries with indexes
   - Use database connection pooling

2. **Blockchain Level**
   - Batch blockchain queries where possible
   - Implement smart caching for balance checks
   - Use WebSocket connections for real-time updates
   - Consider using multiple RPC endpoints for redundancy

## Troubleshooting

### Common Issues

1. **Wallet Creation Fails**
   - Check database connectivity
   - Verify encryption key configuration
   - Ensure unique constraints are properly set

2. **Blockchain Connection Issues**
   - Verify RPC URL is accessible
   - Check smart contract addresses
   - Confirm admin private key permissions

3. **Performance Issues**
   - Monitor database query performance
   - Check for memory leaks in Node.js
   - Verify network latency to blockchain RPC

### Support Contacts

- Technical Support: technical@nepalipay.com
- Infrastructure Team: infrastructure@nepalipay.com
- Emergency Hotline: +977-XXX-XXXX

---

For additional deployment support or questions, please refer to the development team or create a support ticket in our internal tracking system.