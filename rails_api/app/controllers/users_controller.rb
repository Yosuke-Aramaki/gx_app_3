class UsersController < ApplicationController
  def index
    render json: {
      msg: "Hello!!!!!"
    }
  end
end
