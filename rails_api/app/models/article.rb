class Article < ApplicationRecord
  belongs_to :user
  belongs_to :category
  validates :article_url, uniqueness: { scope: :user, message: "すでに保存されています" }
end
