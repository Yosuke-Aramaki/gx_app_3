class CreateArticles < ActiveRecord::Migration[5.2]
  def change
    create_table :articles do |t|
      t.string :title
      t.string :article_url
      t.string :og_image_url
      t.text :article_note
      t.boolean :is_read
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
