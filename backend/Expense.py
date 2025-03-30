from flask import Flask, render_template, request, redirect, url_for, flash
import sqlite3
import os
import matplotlib.pyplot as plt
from io import BytesIO
import base64
from datetime import datetime

app = Flask(__name__)
app.secret_key = "expense_tracker_secret"

def init_db():
    conn = sqlite3.connect("expenses.db")
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS expenses (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        date TEXT,
                        category TEXT,
                        amount REAL,
                        description TEXT)''')
    conn.commit()
    conn.close()

@app.route("/")
def index():
    conn = sqlite3.connect("expenses.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, date, category, amount, description FROM expenses")
    expenses = cursor.fetchall()
    conn.close()

    # 🔹 Convert date format (YYYY-MM-DD → DD/MM/YYYY)
    formatted_expenses = []
    for expense in expenses:
        try:
            date_obj = datetime.strptime(expense[1], "%Y-%m-%d")  # Convert string to datetime
            formatted_date = date_obj.strftime("%d/%m/%Y")  # Convert to required format
        except ValueError:
            formatted_date = expense[1]  # Keep original if invalid

        formatted_expenses.append((expense[0], formatted_date, expense[2], expense[3], expense[4]))

    return render_template("index.html", expenses=formatted_expenses)

@app.route("/add", methods=["POST"])
def add_expense():
    date = request.form["date"]
    category = request.form["category"]
    amount = request.form["amount"]
    description = request.form["description"]
    
    try:
        amount = float(amount)
    except ValueError:
        flash("Invalid amount format.", "error")
        return redirect(url_for("index"))
    
    conn = sqlite3.connect("expenses.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO expenses (date, category, amount, description) VALUES (?, ?, ?, ?)",
                   (date, category, amount, description))
    conn.commit()
    conn.close()
    
    flash("Expense added successfully!", "success")
    return redirect(url_for("index"))

@app.route("/delete/<int:expense_id>", methods=["POST"])
def delete_expense(expense_id):
    conn = sqlite3.connect("expenses.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM expenses WHERE id = ?", (expense_id,))
    conn.commit()
    conn.close()
    
    flash("Expense deleted successfully!", "success")
    return redirect(url_for("index"))

@app.route("/summary")
def show_summary():
    conn = sqlite3.connect("expenses.db")
    cursor = conn.cursor()
    cursor.execute("SELECT category, SUM(amount) FROM expenses GROUP BY category")
    data = cursor.fetchall()
    conn.close()
    
    if not data:
        flash("No expenses to summarize.", "error")
        return redirect(url_for("index"))
    
    categories, amounts = zip(*data)
    plt.figure(figsize=(6,6))
    plt.pie(amounts, labels=categories, autopct="%1.1f%%", startangle=140)
    plt.title("Expense Summary by Category")
    
    buffer = BytesIO()
    plt.savefig(buffer, format="png")
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.getvalue()).decode()
    buffer.close()
    
    return render_template("summary.html", image_base64=image_base64)

if __name__ == "__main__":
    init_db()
    app.run(debug=True)
