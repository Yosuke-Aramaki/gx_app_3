class Test
  def self.createUser
    User.create(name: "cc", email: "cc@gmail.com", password: "cc", password_confirmation: "cc")
  end
end