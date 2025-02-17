from flask import Flask, request, jsonify
from services.usersRoutes import leave_ranking,join_ranking,get_rankings,create_ranking,use_geme,get_unique_user_by_email,get_coach_users, get_user, create_user, send_email,get_users,get_clients_users,get_client_users_no_match_routine,update_client_user

def use_geme_route(mail):
    try:
        use_geme(mail)
        return jsonify({"message": "Gem used successfuly"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def join_ranking_route(rankingID,userMail):
    try:
        join_ranking(rankingID,userMail)
        return jsonify({"message": "Join to ranking successfuly"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
      
def leave_ranking_route(rankingID,userMail):
    try:
        leave_ranking(rankingID,userMail)
        return jsonify({"message": "Ranking left successfuly"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_unique_user_by_email_route(mail):
    try:
        user = get_unique_user_by_email(mail)
        return jsonify(user), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500

def get_rankings_route():
    try:
        rankings = get_rankings()
        return jsonify(rankings), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500

def get_user_route(password,mail):
    try:
        user = get_user(mail, password)
        return jsonify(user), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500

def create_user_route(user):
    try:
        created_user = create_user(user)
        return jsonify(created_user), 201
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500

def send_email_route(to_email):
    try:
        result = send_email(to_email)
        return jsonify(result), 200
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500

def get_users_route():
    try:
        users_list = get_users()
        return jsonify(users_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_clients_users_route():
    try:
        clients_list = get_clients_users()
        return jsonify(clients_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_coach_users_route():
    try:
        coaches_list = get_coach_users()
        return jsonify(coaches_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_client_users_no_match_routine_route(routine):
    try:
        users_list = get_client_users_no_match_routine(routine)
        return jsonify(users_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def update_users_info_route(newUser):
    try:
        update_client_user(newUser)
        return jsonify({"message": "User updates successfuly"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def create_ranking_route(newRanking):
    try:
        ranking_created = create_ranking(newRanking)
        return jsonify(ranking_created), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500