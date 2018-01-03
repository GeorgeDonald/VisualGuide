require 'pry'
class RecordsController < ApplicationController
  before_action :authenticate_user!

  def index
    @records = Record.where("user_id=#{current_user.id} and status=1").order(updated_at: :desc)
    if(!@records.empty?)
      @record = @records[0]
      redirect_to "/records/#{@record.id}"
      return
    end

    @my_schedule_records = Record.where("user_id = #{current_user.id} and status = 0")
    @my_finished_records = Record.where("user_id = #{current_user.id} and status = 3")
    @other_records = Record.where("user_id != #{current_user.id} and status = 3")
  end

  def new
    @record = Record.new
    pos = getCurUserPos
    @record.latitude = pos[:latitude];
    @record.longitude = pos[:longitude];
    @record.heading = pos[:heading];
    @record.pitch = pos[:pitch];
  end

  def edit
    @record = Record.find(params[:id])
  end

  def create
    @record = Record.new(record_params)
    if(@record.save)
      redirect_to records_path
    else
      redirect_to new_record_path, notice: "Error occured."
    end
  end

  def destroy
    @record = Record.find(params[:id])
    if(@record)
      @record.destroy
    end
    redirect_to records_path
  end

  def update
    binding.pry
    @record = Record.find(params[:id])
    prms = record_params
    if prms[:name]
      prms['user_id']=current_user.id;
      prms['status']=0;
      if(@record.update(prms))
        redirect_to records_path
      else
        redirect_to edit_record_path, notice: "Error occured."
      end
    else
      @record.update(status_params)
      render :json => {}
    end
  end

  def show
    @record = Record.find(params[:id])
    if(@record.status==0)
      @record.status=1
      @record.save
    end
  end

  private
  def record_params
    params.require(:record).permit(:name,:description,:latitude,:longitude,:heading,:pitch)
  end
  def status_params
    params.require(:record).permit(:status)
  end
end
