require 'pry'
class AppearanceChannel < ApplicationCable::Channel
  def subscribed
    binding.pry
    stream_from "AppearanceChannel_#{params[:id]}"
    Follower.create(guide_id: params[:id], user_id: current_user.id)
    ActionCable.server.broadcast("AppearanceChannel_#{params[:id]}", {})
  end

  def unsubscribed
    binding.pry
    ActionCable.server.broadcast("AppearanceChannel_#{params[:id]}", {})
  end
end
