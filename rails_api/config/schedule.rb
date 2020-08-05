# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron

# require File.expand_path(File.dirname(__FILE__) + "/environment")
# set :output, 'log/cron.log'

# wheneverにrailsを起動する必要があるためRails.rootを使用
require File.expand_path(File.dirname(__FILE__) + "/environment")
# cronを実行する環境変数
rails_env = ENV['RAILS_ENV'] || :development
# cronを実行する環境変数をセット
set :environment, rails_env

# set :environment, :development

# set :rbenv_root, '~/.rbenv'
# set :rbenv_version, '2.6.3'
# env 'RBENV_ROOT', rbenv_root
# env 'RBENV_VERSION', rbenv_version
# job_type :rake, 'export PATH="$HOME/.rbenv/bin:$PATH"; eval "$(rbenv init -)"; cd :path && :environment_variable=:environment bundle exec rake :task --silent :output'

# set      :job_template, "source $HOME/.zshrc; $(which zsh) -l -c ':job'"
ENV.each { |k, v| env(k, v) }
env :PATH, ENV['PATH']
set :job_template, "/bin/zsh -l -c ':job'"
job_type :rake,    "export PATH=\"$HOME/.rbenv/bin:$PATH\"; eval \"$(rbenv init -)\"; cd :path && RAILS_ENV=:environment bundle exec rake :task :output"
job_type :runner,  "export PATH=\"$HOME/.rbenv/bin:$PATH\"; eval \"$(rbenv init -)\"; cd :path && bundle exec rails runner -e :environment ':task' :output"
# job_type :rake,         "cd :path && :environment_variable=:environment bundle exec rake :task --silent :output"

# set :environment, :development

# ENV['RAILS_ENV'] ||= 'development'
# set :environment, ENV['RAILS_ENV']

# cronのログの場所
set :output, "log/cron.log" #,{ :error => 'log/whenever.log', :standard => 'log/cron.log' }

# every 1.hours, at: 40 do
#   runner 'User.create(name: "cc", email: "cc@gmail.com", password: "cc", password_confirmation: "cc")'
# end

# every 1.hours, at: 46 do
every 2.minutes do
  runner 'User.create(name: "dd", email: "dd@gmail.com", password: "cc", password_confirmation: "cc")'
  runner "Test.yakisoba", :environment => :development
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

