require 'pry'
class TravelsController < ApplicationController
  before_action :authenticate_user!

  def index
    @travels = Travel.where("user_id='#{current_user.id}'")
  end

  def new
    @travel = Travel.new
    pos = getCurUserPos
    @travel.start_latitude = pos[:latitude];
    @travel.start_longitude = pos[:longitude];
    @travel.end_latitude = pos[:latitude];
    @travel.end_longitude = pos[:longitude];
  end

  def edit
    @travel = Travel.find(params[:id])
  end

  def show
    @travel = Travel.find(params[:id])
  end

  def create
    travel = Travel.new(travel_params)
    if(travel.save)
      redirect_to travels_path
    else
      redirect_to new_travel_path, notice: "Error occured."
    end
  end

  def update
    @travel = Travel.find(params[:id])
    if(@travel.update(travel_params))
      redirect_to travels_path
    else
      redirect_to edit_travel_path, notice: "Error occured."
    end
  end

  def destroy
    @travel = Travel.find(params[:id])
    if(@travel)
      @travel.destroy
    end
    redirect_to travels_path
  end

  private
  def travel_params
    params['travel']['user_id']=current_user.id;
    params.require(:travel).permit(:user_id, :name, :introduction, :start_name, :start_latitude, :start_longitude, :end_name, :end_latitude, :end_longitude)
  end
end
