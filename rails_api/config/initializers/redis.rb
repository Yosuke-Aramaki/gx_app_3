require 'redis'
Redis.current = Redis.new(url: 'redis://redis:6379')