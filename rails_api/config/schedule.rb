# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron


# wheneverにrailsを起動する必要があるためRails.rootを使用
require File.expand_path(File.dirname(__FILE__) + "/environment")

# 環境変数をうまい感じにやってくれる
ENV.each { |k, v| env(k, v) }

# ログを書き出すようファイル
set :output, error: 'log/crontab_error.log', standard: 'log/crontab.log'
set :environment, :development

# # cronを実行する環境変数 Dockerを使用しない場合
# rails_env = ENV['RAILS_ENV'] || :development
# # cronを実行する環境変数をセット
# ENV['RAILS_ENV'] ||= 'development'
# set :environment, ENV['RAILS_ENV']

# set :job_template, "/bin/zsh -l -c ':job'"
# job_type :rake,    "export PATH=\"$HOME/.rbenv/bin:$PATH\"; eval \"$(rbenv init -)\"; cd :path && RAILS_ENV=:environment bundle exec rake :task :output"
# job_type :runner,  "export PATH=\"$HOME/.rbenv/bin:$PATH\"; eval \"$(rbenv init -)\"; cd :path && bundle exec rails runner -e :environment ':task' :output"


# every 1.hours, at: 46 do
every 1.minutes do
  rake 'remind_task:check_remind_time'
  # runner "Test.createUser", :environment => :development # runnnerの例
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

