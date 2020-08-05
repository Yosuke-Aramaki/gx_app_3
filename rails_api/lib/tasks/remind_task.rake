namespace :remind_task do
  desc "check_remind_time"
  task check_remind_time: :environment do
    # @remind = Remind.where(user_id: 1)
    User.create(name: "ee", email: "ee@gmail.com", password: "ee", password_confirmation: "ee")
  end
end
