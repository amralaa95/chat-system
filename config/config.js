module.exports = {
  development: {
    use_env_variable: 'DATABASE_URI',
    retry: {
      count: parseInt(process.env.RETRY_COUNT) || 3,
      initial_timeout: parseInt(process.env.INITIAL_RETRY_TIMEOUT) || 1000,
      timeout: parseInt(process.env.ENDPOINT_TIMEOUT) || 6000
    }
  },
  test: {
    use_env_variable: 'TEST_DATABASE_URI',
    retry: {
      count: parseInt(process.env.RETRY_COUNT) || 3,
      initial_timeout: parseInt(process.env.INITIAL_RETRY_TIMEOUT) || 1000,
      timeout: parseInt(process.env.ENDPOINT_TIMEOUT) || 6000
    }
  },
  production: {
    use_env_variable: 'DATABASE_URI',
    retry: {
      count: parseInt(process.env.RETRY_COUNT) || 3,
      initial_timeout: parseInt(process.env.INITIAL_RETRY_TIMEOUT) || 1000,
      endpoint_timeout: parseInt(process.env.ENDPOINT_TIMEOUT) || 6000
    },
    pool: {
      max: process.env.DATABASE_POOL_MAX !== undefined ? parseInt(process.env.DATABASE_POOL_MAX) : 5,
      min: process.env.DATABASE_POOL_MIN !== undefined ? parseInt(process.env.DATABASE_POOL_MIN) : 1,
      acquire: process.env.DATABASE_POOL_ACQUIRE !== undefined ? parseInt(process.env.DATABASE_POOL_ACQUIRE) : 15000,
      evict: process.env.DATABASE_POOL_EVICT !== undefined ? parseInt(process.env.DATABASE_POOL_EVICT) : 10000
    }
  }
}
