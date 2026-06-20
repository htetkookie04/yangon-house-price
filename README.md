# 🏙️ Yangon House Price Predictor

An end-to-end machine-learning system that estimates residential property prices
across the townships of Yangon, Myanmar. A serialised Scikit-Learn pipeline is
served by a **FastAPI** backend (`main.py`) and consumed by an interactive,
responsive **Tailwind CSS** web interface (`index.html`) — turning raw real
estate data into an instant, objective price estimate.

---

## 🧰 Tech Stack

![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat&logo=fastapi&logoColor=white)
![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.6-F7931E?style=flat&logo=scikitlearn&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-2.2-150458?style=flat&logo=pandas&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Uvicorn](https://img.shields.io/badge/Uvicorn-ASGI-2C2C2C?style=flat)

---

## 📂 Directory Architecture

```
yangon-house-price/
├── main.ipynb                     # Stage 1 — data cleaning, model training & selection
├── Yangon-House-Price-Dataset.csv # Raw dataset (967 listings, 13 columns)
├── house_price_model.pkl          # Serialised bundle: fitted pipeline + metadata
├── main.py                        # Stage 2 — FastAPI inference service
├── index.html                     # Stage 3 — Tailwind CSS frontend UI
├── FINAL_REPORT.md                # Academic technical report
├── SLIDES.md                      # Presentation deck + speaker notes
└── README.md                      # You are here
```

---

## ⚙️ How It Works

1. **`main.ipynb`** cleans the data, builds a `ColumnTransformer` preprocessing
   pipeline (median imputation + `StandardScaler` for numeric features;
   most-frequent imputation + `OneHotEncoder` for the township), benchmarks
   Linear Regression, Random Forest, and Gradient Boosting under 5-fold
   cross-validation, and serialises the winning pipeline to
   `house_price_model.pkl`.
2. **`main.py`** loads that pipeline at startup and exposes it over HTTP.
3. **`index.html`** fetches the township list, posts the user's inputs, and
   renders the predicted price.

---

## 🚀 Local Installation & Setup

> **Note:** This project is pinned to **Python 3.12** with specific package
> versions. `scikit-learn==1.6.1` must match the version the model was trained
> with to avoid version-mismatch warnings and invalid predictions.

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd yangon-house-price
```

### 2. Create and activate a virtual environment

**Windows (PowerShell):**

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**macOS / Linux (bash):**

```bash
python3.12 -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies

```bash
pip install fastapi==0.115.6 "uvicorn[standard]==0.34.0" \
    scikit-learn==1.6.1 scipy==1.13.1 numpy==1.26.4 \
    pandas==2.2.3 pydantic==2.10.4
```

---

## ▶️ Running the Application

### 1. Start the API server

With the virtual environment active, launch Uvicorn:

```bash
uvicorn main:app --reload
```

The API will be available at **http://127.0.0.1:8000**.
Interactive auto-generated docs are at **http://127.0.0.1:8000/docs**.

> Alternatively, `python main.py` runs the built-in Uvicorn launcher on the same
> host and port.

### 2. Launch the frontend

Open **`index.html`** directly in your browser (double-click it, or use a Live
Server extension). The page automatically calls the running API to populate the
township dropdown and to fetch predictions.

---

## 🔌 API Documentation

### `GET /townships`

Returns the list of townships the model was trained on (used to populate the UI
dropdown).

**Response:**

```json
{
  "townships": ["Ahlone", "Bahan", "Botahtaung", "Dawbon", "Hlaing", "..."]
}
```

### `POST /predict`

Predicts a price from a property's structural features.

**Request body:**

```json
{
  "tsp_en": "Dawbon",
  "bedroom": 2,
  "bathroom": 1,
  "aircorn": 1,
  "floor": 3,
  "overhead_tank": 1
}
```

**Response:**

```json
{
  "status": "success",
  "predicted_price": 347.54
}
```

**Quick test (PowerShell):**

```powershell
$body = '{"tsp_en":"Dawbon","bedroom":2,"bathroom":1,"aircorn":1,"floor":3,"overhead_tank":1}'
Invoke-RestMethod -Uri http://127.0.0.1:8000/predict -Method Post -ContentType 'application/json' -Body $body
```

**Quick test (curl):**

```bash
curl -X POST http://127.0.0.1:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"tsp_en":"Dawbon","bedroom":2,"bathroom":1,"aircorn":1,"floor":3,"overhead_tank":1}'
```

---

## 👥 Team Tracks & Contributions

| Track | Focus | Technical Contribution |
|---|---|---|
| 🗂️ **Data Track** | Data engineering | Cleaned the 967-row dataset, handled missing values, built the `ColumnTransformer` preprocessing pipeline |
| 🤖 **Model Track** | ML modelling | Benchmarked 3 regressors via 5-fold CV, selected & serialised the Linear Regression pipeline |
| 🚀 **Deployment Track** | Backend / API | Built the FastAPI service, Pydantic validation, CORS, and the `.venv` runtime setup |
| 🎨 **Frontend Track** | UI / UX | Built the responsive Tailwind CSS interface and wired it to the API |
| ⚖️ **Evaluation & Ethics Track** | Analysis | Authored the report, cross-validation analysis, and the AI ethics / bias assessment |

---

## 📊 Model Performance (Transparency)

| Model | 5-Fold CV R² |
|---|---|
| **Linear Regression (selected)** | **0.214** |
| Gradient Boosting | 0.191 |
| Random Forest | 0.120 |

Held-out test set: **MAE 62.30 · RMSE 72.46 · R² 0.125**.

> ⚠️ The model explains a modest share of price variance and is missing
> high-signal features such as square footage. It is intended as a **non-binding
> reference estimate**, not a professional appraisal. See `FINAL_REPORT.md` for
> the full evaluation and ethics discussion.

---

## 📄 License

Academic group project for **CST-3121**. For educational use.
