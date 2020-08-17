class Api::V1::RemindsController < ApplicationController

  def index 
    @remind = Remind.where(user_id: current_user.id).select("id, day_of_the_week, user_id")
    render json: @remind.to_json
  end

  def get_remind_time
    @remind = Remind.where(user_id: current_user.id).select("remind_time")
    render json:  @remind[0].remind_time.strftime("%H:%M").to_json
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
