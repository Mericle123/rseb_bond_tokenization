import crypto  from  "crypto"

const ALGORITHM = process.env.ENCRYPT_ALGORITHM
const IV_LENGTH = 16

export function encrypt(text: string, key:string) : string{
    const hashedKey = crypto.createHash("sha256").update(key).digest();

    const iv = crypto.randomBytes(IV_LENGTH)

    if(!ALGORITHM){
        throw new  Error("NO ALGORITHM FOUND")
    }
    const cipher = crypto.createCipheriv(ALGORITHM, hashedKey, iv);
    let  encrypted = cipher.update(text, "utf8", "hex")
    encrypted += cipher.final("hex")

    return iv.toString("hex") + ":" + encrypted
}

export function decrypt(encryptedData: string, key: string): string{
    const hashedKey = crypto.createHash("sha256").update(key).digest()

    const [ivHex, encryptedText] = encryptedData.split(":")
    const iv = Buffer.from(ivHex, "hex");

     if(!ALGORITHM){
        throw new  Error("NO ALGORITHM FOUND")
    }

    const decipher = crypto.createDecipheriv(ALGORITHM, hashedKey, iv);
    let decrypted  = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8")
    
    return decrypted;
}


