module Api
  module V1
    class UsersController < ApplicationController
      def index
        render json: {
          msg: "Hello!!!!!"
        }
      end
    end
  end
end