# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


200.times do |i|
  User.create(
    name: "sample#{i}",
    email: "sample#{i}@gmail.com",
    password: "sample#{i}", 
    password_confirmation: "sample#{i}",
  )

  200.times do |j|
    if j < 100 then 
      Article.create(
        title: "How to research database performance #{i}#{j}", 
        article_url: "https://oss.gaiax-blockchain.com/#{i}#{j}",
        og_image_url: "https://oss.gaiax-blockchain.com/static/media/gaiax-oss-blockchain.png/#{i}#{j}",
        article_note: "DB performance research 1. Set Database 2. Put a bunch of data in that database 3. Query with certain condition 4. research and do again and again and again ........ #{i}#{j}",
        is_read: :true,
        user_id: i,
      )
    elsif j < 130 then 
      Article.create(
        title: "How to research database performance #{i}#{j}", 
        article_url: "https://oss.gaiax-blockchain.com/#{i}#{j}",
        og_image_url: "https://oss.gaiax-blockchain.com/static/media/gaiax-oss-blockchain.png/#{i}#{j}",
        article_note: "DB performance research 1. Set Database 2. Put a bunch of data in that database 3. Query with certain condition 4. research and do again and again and again ........ #{i}#{j}",
        is_read: :false,
        user_id: i,
      )
    else
      Article.create(
        title: "How to research database performance #{i}#{j}", 
        article_url: "https://oss.gaiax-blockchain.com/#{i}#{j}",
        og_image_url: "https://oss.gaiax-blockchain.com/static/media/gaiax-oss-blockchain.png/#{i}#{j}",
        article_note: "DB performance research 1. Set Database 2. Put a bunch of data in that database 3. Query with certain condition 4. research and do again and again and again ........ #{i}#{j}",
        is_read: :true,
        user_id: i,
      )
    end
  end
end