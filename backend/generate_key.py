from cryptography.fernet import Fernet

def generate_key():
    key = Fernet.generate_key().decode()
    print(f"Your encryption key: {key}")

if __name__ == "__main__":
    generate_key()
