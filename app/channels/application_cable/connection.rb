module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :verified_user

    def connect
      self.verified_user = find_verified_user
    end

    private
      def find_verified_user
        if verified_user = User.find_by(id: cookies.signed[:current_user_id])
          verified_user
        else
          reject_unauthorized_connection
        end
      end
  end
end
