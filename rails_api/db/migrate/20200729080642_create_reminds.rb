class CreateReminds < ActiveRecord::Migration[5.2]
  def change
    create_table :reminds do |t|
      t.integer :day_of_the_week
      t.time :remind_time
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
