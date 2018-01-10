#require 'pry'
require "open-uri"
class CurrentPositionsController < ApplicationController

  def update
    if(user_signed_in?)
      if(!current_user.current_position)
        current_user.current_position = CurrentPosition.create(cp_params)
      else
        current_user.current_position.update(cp_params)
      end
      # url = "https://maps.googleapis.com/maps/api/streetview?size=640x480&fov=120&location=#{params[:latitude]},#{params[:longitude]}&heading=#{params[:heading]}&pitch=#{params[:pitch]}&key=AIzaSyCP_WRLvaPXMHDw71qCoj0TlhQqsYoCKyA"
      # #src="https://maps.googleapis.com/maps/api/streetview?size=640x480&fov=120&location=39.96239870623947,-75.17678260803223&heading=321.0&pitch=22.0&key=AIzaSyCP_WRLvaPXMHDw71qCoj0TlhQqsYoCKyA"
      # file = open(url)
      # if(file)
      #   send_data file.read
      # else
      #   render :json => {}
      # end
    end
    render :json => {}
  end

  def streetview
    #binding.pry
    url = "https://maps.googleapis.com/maps/api/streetview?size=640x480&fov=120&location=#{params[:location]}&heading=#{params[:heading]}&pitch=#{params[:pitch]}&key=AIzaSyCP_WRLvaPXMHDw71qCoj0TlhQqsYoCKyA"
    #src="https://maps.googleapis.com/maps/api/streetview?size=640x480&fov=120&location=39.96239870623947,-75.17678260803223&heading=321.0&pitch=22.0&key=AIzaSyCP_WRLvaPXMHDw71qCoj0TlhQqsYoCKyA"
    begin
      file = open(url)
      if(file)
        send_data file.read, :type => file.meta['content-type'], :disposition => 'inline'
      else
        render :json => {status: 404}
      end
    rescue
      render :json => {status: 404}
    end
  end

  private
  def cp_params
    params['current_position']['user_id']=current_user.id;
    params.require(:current_position).permit(:user_id, :latitude, :longitude, :heading, :pitch)
  end
end
