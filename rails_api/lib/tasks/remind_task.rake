namespace :remind_task do
  desc "check_remind_time"
  task check_remind_time: :environment do
    @remind = Remind.where(user_id: 1)
  end
end
