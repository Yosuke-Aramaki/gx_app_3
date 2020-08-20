class Api::V1::RemindsController < ApplicationController

  def index 
    @remind = Remind.where(user_id: current_user.id).select("id, day_of_the_week, user_id")
    render json: @remind.to_json
  end

  # time型をそのまま取得すると無駄なデータまで取得するのでremind_timeは整形して取り出す
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

  def update
    @remind = Remind.find_by(day_of_the_week: params[:remind][:day_of_the_week], user_id: current_user.id)
    if @remind.update(remind_time: params[:remind][:remind_time])
      render json: @remind.to_json
    else
      render json: { messages: @remind.errors }, status: :unauthorized
    end
  end

  def check_reminds
    if Remind.find_by(day_of_the_week: params[:remind][:day_of_the_week], user_id: current_user.id)
      update
    else
      create
    end 
  end

  private
  def remind_params
    params.require(:remind).permit(:day_of_the_week, :remind_time)
  end

end
