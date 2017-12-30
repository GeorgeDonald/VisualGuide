require 'test_helper'

class CurrentPositionsControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    get current_positions_new_url
    assert_response :success
  end

end
