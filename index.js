import base64
import secrets
import sys
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.backends import default_backend

def genera_chiave_estrema(password: str, salt: bytes):
    """Trasforma la password in una chiave blindata (1 milione di cicli)."""
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=1_000_000,
        backend=default_backend()
    )
    return kdf.derive(password.encode())

def cripta(password, messaggio):
    salt = secrets.token_bytes(16)
    nonce = secrets.token_bytes(12)
    chiave = genera_chiave_estrema(password, salt)
    aesgcm = AESGCM(chiave)
    
    # Cripta il messaggio
    dati_criptati = aesgcm.encrypt(nonce, messaggio.encode(), None)
    
    # Unisce Sale + Nonce + Messaggio e trasforma in testo leggibile (Base64)
    risultato_finale = base64.b64encode(salt + nonce + dati_criptati).decode('utf-8')
    return risultato_finale

def decripta(password, testo_criptato):
    try:
        dati_grezzi = base64.b64decode(testo_criptato)
        salt = dati_grezzi[:16]
        nonce = dati_grezzi[16:28]
        messaggio_chiuso = dati_grezzi[28:]
        
        chiave = genera_chiave_estrema(password, salt)
        aesgcm = AESGCM(chiave)
        
        chiaro = aesgcm.decrypt(nonce, messaggio_chiuso, None)
        return chiaro.decode('utf-8')
    except Exception:
        return "❌ ERRORE: Password sbagliata o codice corrotto!"

# --- INTERFACCIA DI CONTROLLO ---
print("--- CRYPTATORE ESTREMO PYTHON ---")
scelta = input("Cosa vuoi fare? (1) CRIPTA  (2) DECRIPTA: ")
pass_utente = input("Inserisci la Password Segreta: ")

if scelta == "1":
    testo = input("Scrivi il messaggio da nascondere: ")
    codice = cripta(pass_utente, testo)
    print("\n✅ MESSAGGIO CRIPTATO (Invia questo):")
    print(f"------------------------------------\n{codice}\n------------------------------------")

elif scelta == "2":
    codice_da_aprire = input("Incolla qui il codice criptato: ")
    print("\n...Analisi in corso (il milione di cicli richiede un attimo)...")
    originale = decripta(pass_utente, codice_da_aprire)
    print(f"\n🔓 MESSAGGIO ORIGINALE:\n{originale}")
else:
    print("Scelta non valida.")
