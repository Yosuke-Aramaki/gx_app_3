class User < ApplicationRecord
  has_many :articles
  has_many :categories
  has_many :reminds
  validates :name,  presence: true, 
                    length: { minimum:2, maximum: 30 }
  validates :email, presence: true, 
                    length: { maximum: 255 }, 
                    uniqueness: true,
                    format: { with: /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i }
  before_validation { email.downcase! }
  has_secure_password
  validates :password,  presence: true, 
                        length: { minimum: 4, maximum: 30 }
end
