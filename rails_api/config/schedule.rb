# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron


# wheneverにrailsを起動する必要があるためRails.rootを使用
require File.expand_path(File.dirname(__FILE__) + "/environment")


ENV.each { |k, v| env(k, v) }

set :output, error: 'log/crontab_error.log', standard: 'log/crontab.log' # ログを書き出すようにしておくとデバッグが楽
set :environment, :development

# cronのログの場所
# set :output, "log/cron.log" #,{ :error => 'log/whenever.log', :standard => 'log/cron.log' }

# every 1.hours, at: 40 do
#   runner 'User.create(name: "cc", email: "cc@gmail.com", password: "cc", password_confirmation: "cc")'
# end


# every 1.hours, at: 46 do
every 2.minutes do
  # runner 'User.create(name: "dd", email: "dd@gmail.com", password: "cc", password_confirmation: "cc")'
  # runner "Test.yakisoba", :environment => :development
  rake 'remind_task:check_remind_time'
end


# every 1.minute do
#   command "echo 'mossmossmossmossmossmoss'"
# end 

# Example:
#
# set :output, "/path/to/my/cron_log.log"
#
# every 2.hours do
#   command "/usr/bin/some_great_command"
#   runner "MyModel.some_method"
#   rake "some:great:rake:task"
# end
#
# every 4.days do
#   runner "AnotherModel.prune_old_records"
# end

# Learn more: http://github.com/javan/whenever

