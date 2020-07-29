class Remind < ApplicationRecord
  belongs_to :user
  validates :remind_time,  presence: true,
  validates :day_of_the_week,  presence: true,
end
