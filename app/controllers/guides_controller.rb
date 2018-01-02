class GuidesController < ApplicationController
  before_action :authenticate_user!
  def index
    @guides = Guide.where("user_id=#{current_user.id} and status=1")
    if(!@guides.empty?)
      @guide = @guides[0]
      redirect_to "/guides/#{@guide.id}"
      return
    end
    @my_guides = Guide.where("user_id = #{current_user.id}")
    @other_guides = Guide.where("user_id != #{current_user.id} and status = 1")
  end

  def show
    @guide = Guide.find(params[:id])
  end

  def new
    @guide = Guide.new
    pos = getCurUserPos
    @guide.latitude = pos[:latitude];
    @guide.longitude = pos[:longitude];
    @guide.heading = pos[:heading];
    @guide.pitch = pos[:pitch];
  end

  def edit
    @guide = Guide.find(params[:id])
  end

  def create
    @guide = Guide.new(guide_params)
    if(@guide.save)
      redirect_to guides_path
    else
      redirect_to new_guide_path, notice: "Error occured."
    end
  end

  def update
    @guide = Guide.find(params[:id])
    if(@guide.update(guide_params))
      redirect_to guides_path
    else
      redirect_to edit_guide_path, notice: "Error occured."
    end
  end

  def destroy
    @guide = Guide.find(params[:id])
    if(@guide)
      @guide.destroy
    end
    redirect_to guides_path
  end
  private
  def guide_params
    params['guide']['user_id']=current_user.id;
    params.require(:guide).permit(:user_id, :title,:description,:latitude,:longitude,:heading,:pitch)
  end
end
