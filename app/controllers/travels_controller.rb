class TravelsController < ApplicationController
  before_action :authenticate_user!

  def index
    @travels = Travel.where("user_id='#{current_user.id}'")
  end

  def new
    @travel = Travel.new
  end

  def edit
    @travel = Travel.find(params[:id])
  end

  def show
  end

  def create
    Travel.create(travel_params)
    redirect travels_path
  end

  def update
    @travel = Travel.find(params[:id])
    redirect travels_path
  end

  def destroy
    @travel = Travel.find(params[:id])
    if(@travel)
      @travel.destroy
    end
    redirect travels_path
  end

  private
  def travel_params
    params.require(:travel).permit(:name)
  end
end
