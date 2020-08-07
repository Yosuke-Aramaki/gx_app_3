namespace :remind_task do
  desc "check_remind_time"
  task check_remind_time: :environment do
    # @remind = Remind.where(user_id: 1)
    User.create(name: "cc", email: "cc@gmail.com", password: "cc", password_confirmation: "cc")
  end
end
