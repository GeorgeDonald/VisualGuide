class CurrentPositionsController < ApplicationController
  before_action :authenticate_user!
  def update
    if(!current_user.current_position)
      current_user.current_position = CurrentPosition.create(cp_params)
    else
      current_user.current_position.update(cp_params)
    end
  end

  private
  def cp_params
    params['current_position']['user_id']=current_user.id;
    params.require(:current_position).permit(:user_id, :latitude, :longitude, :heading, :pitch)
  end
end
