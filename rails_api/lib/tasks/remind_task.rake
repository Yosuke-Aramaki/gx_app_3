namespace :remind_task do
  desc "check_remind_time"
  task check_remind_time: :environment do
    require 'date'
    time = Time.now.in_time_zone("Tokyo")
    remind_time = time.hour.to_s + ':' + time.min.to_s + ':00'
    @remind = Remind.where(day_of_the_week: time.wday, remind_time: remind_time).select("user_id")
    
    include HTTParty

    API_URI = 'https://onesignal.com/api/v1/notifications'.freeze
    headers = {
      'Authorization' => 'Basic NjA5OWViN2QtMmRlMi00OWViLTk4ZjItOGJlYjYzOGM3OTg3',
      'Content-Type'  => 'application/json'
    }
    contents = { 'en' => 'You have unread articles!', 'ja' => '未読の記事がたまってます' }
    
    @remind.length.times do |i|
      body = {
        'app_id' => 'c3c52b3b-e0f2-423b-9491-8ba8784e6434',
        'title' => 'Gx app 3',
        'url'    => 'localhost:5000',
        "filters" => [{"field": "tag", "key": "customId", "relation": "=", "value": @remind[i].user_id}],
        'contents' => contents
      }.to_json
  
      HTTParty.post(API_URI, headers: headers, body: body)
    end
    
  
  end
end
