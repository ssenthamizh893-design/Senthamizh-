# Dogs vs. Cats using HOG + SVM
# ------------------------------
import os, glob
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from skimage.io import imread
from skimage.transform import resize
from skimage.feature import hog
from tqdm import tqdm

# 1) Paths (edit this to your dataset root)
CAT_DIR = "data/train/cats"
DOG_DIR = "data/train/dogs"

# 2) Helper: extract HOG features from one image path
def extract_hog(fp, img_size=(128, 128)):
    img = imread(fp, as_gray=True)               # read as grayscale
    img = resize(img, img_size, anti_aliasing=True)
    # HOG params: balanced between speed & accuracy
    features = hog(
        img, orientations=9, pixels_per_cell=(8, 8),
        cells_per_block=(2, 2), block_norm="L2-Hys", transform_sqrt=True
    )
    return features

# 3) Load images and build X, y
X, y = [], []
# Limit per class (optional for quick runs). Set to None to use all.
LIMIT = 600   # try 300–1000 per class depending on your machine

def load_folder(folder, label, limit=None):
    files = glob.glob(os.path.join(folder, "*"))
    if limit: files = files[:limit]
    for fp in tqdm(files, desc=f"Loading {label}"):
        try:
            X.append(extract_hog(fp))
            y.append(label)
        except Exception:
            # skip unreadable/broken images
            pass

load_folder(CAT_DIR, 0, LIMIT)   # 0 = cat
load_folder(DOG_DIR, 1, LIMIT)   # 1 = dog

X = np.array(X)
y = np.array(y)
print("Feature matrix shape:", X.shape, "| Labels:", y.shape)

# 4) Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 5) Scale (SVM works better when features are scaled)
scaler = StandardScaler(with_mean=False)   # with_mean=False for sparse-like HOG
X_train_s = scaler.fit_transform(X_train)
X_test_s  = scaler.transform(X_test)

# 6) Train SVM (linear kernel is a strong baseline for HOG)
clf = SVC(kernel="linear", C=1.0, random_state=42)
clf.fit(X_train_s, y_train)

# 7) Evaluate
y_pred = clf.predict(X_test_s)
acc = accuracy_score(y_test, y_pred)
print(f"\nAccuracy: {acc:.4f}")
print("\nClassification Report:\n", classification_report(y_test, y_pred, target_names=["Cat","Dog"]))
print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))

# 8) Try a single prediction (use any test image path)
sample_path = glob.glob(os.path.join(DOG_DIR, "*"))[0]
sample_feat = scaler.transform([extract_hog(sample_path)])
pred = clf.predict(sample_feat)[0]
print(f"\nSample '{os.path.basename(sample_path)}' predicted as:", "Dog" if pred==1 else "Cat")# Senthamizh-
Project 
