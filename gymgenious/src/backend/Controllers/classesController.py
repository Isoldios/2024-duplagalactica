from flask import Flask, request, jsonify
from flask_cors import CORS
from services.classesRoutes import get_classes, create_class,book_class,unbook_class,delete_class,update_class_info



def get_classes_route():
    try:
        classes_list = get_classes()
        return jsonify(classes_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def create_class_route(new_class):
    try:
        new_class = request.json
        created_class = create_class(new_class)
        return jsonify(created_class), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def book_class_route(event,mail):
    try:
        booked_class = book_class(event,mail)
        return jsonify({"message": "Clase actualizado exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def unbook_class_route(event,mail):
    try:
        unbooked_class = unbook_class(event,mail)
        return jsonify({"message": "Clase desagendada exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def delete_class_route(event,mail):
    try:
        deleted_class = delete_class(event,mail)
        return jsonify({"message": "Clase eliminada exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def update_class_info_route(newClass):
    try:
        update_class_info(newClass)
        return jsonify({"message": "Clase actualizada exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
