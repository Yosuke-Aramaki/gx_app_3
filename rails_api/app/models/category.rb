class Category < ApplicationRecord
  belongs_to :user
  validates :category_name,  presence: true
end
