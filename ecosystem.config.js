module.exports = {
  apps: [
    {
      name: 'polymarket-backend',
      script: './dist/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3005
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3005
      },
      env_staging: {
        NODE_ENV: 'production',
        PORT: 3005
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      merge_logs: true,
      // Health check
      health_check_grace_period: 3000,
      health_check_interval: 30000,
      // Restart policy
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      // Advanced settings
      kill_timeout: 5000,
      listen_timeout: 3000,
      // Source map support
      source_map_support: true,
      // Ignore watch (if watch is enabled)
      ignore_watch: [
        'node_modules',
        'logs',
        '*.log'
      ]
    }
  ]
}; 