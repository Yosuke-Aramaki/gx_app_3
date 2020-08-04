class Api::V1::RemindsController < ApplicationController

  skip_before_action :authenticate, only: [:index]

  def index 
    @remind = Remind.where(user_id: 1)
  end

  def create
    @remind = Remind.new(remind_params)
    @remind.user_id = current_user.id
    if @remind.save
      render json: @remind.to_json
    else
      render json: { messages: @remind.errors }, status: :unauthorized
    end
  end

  private
  def remind_params
    params.require(:remind).permit(:day_of_the_week, :remind_time)
  end

end
