namespace :remind_task do
  desc "check_remind_time"
  task check_remind_time: :environment do
    require 'date'
    time = Time.now.in_time_zone("Tokyo")
    remind_time = time.strftime('%H:%M:00')
    @remind = Remind.where(day_of_the_week: time.wday, remind_time: remind_time).select("user_id")
    
    include HTTParty

    API_URI = 'https://onesignal.com/api/v1/notifications'.freeze
    headers = {
      'Authorization' => 'Basic ' + Setting.push[:api_key],
      'Content-Type'  => 'application/json'
    }
    contents = { 'en' => 'You have unread articles!', 'ja' => '未読の記事がたまってます' }
    
    @remind.length.times do |i|
      body = {
        'app_id' => Setting.push[:app_id]
        'title' => 'Gx app 3',
        'url'    => 'localhost:5000',
        "filters" => [{"field": "tag", "key": "customId", "relation": "=", "value": @remind[i].user_id}],
        'contents' => contents
      }.to_json
  
      HTTParty.post(API_URI, headers: headers, body: body)
    end
    
  
  end
end
