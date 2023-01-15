import json

# Usage: python generate_json.py
# Make sure you create an output folder first
# You can edit the values below
url = "ipfs://bafybeicq6q5ryfn7ancm5cnwg2xzp5pim2m3ndajbsc7le6crkqajkwu7e/mi777_jersey.png"

cid_hash_image = "bafybeicq6q5ryfn7ancm5cnwg2xzp5pim2m3ndajbsc7le6crkqajkwu7e"

for x in range(1, 2):
  dictionary = {
    "name": "Milady Moto #" + str(x),
    "description": "The mi777 MiladyMoto Jersey is a Physical + Digital implementation of the beloved Milady Maker Malenciaga jersey trait.\n\n[Model (.glb)](https://bafybeicq6q5ryfn7ancm5cnwg2xzp5pim2m3ndajbsc7le6crkqajkwu7e.ipfs.nftstorage.link/ipfs/bafybeicq6q5ryfn7ancm5cnwg2xzp5pim2m3ndajbsc7le6crkqajkwu7e/mi777_miladyMotoJersey_animated.glb%7D)\n\n",
    "image": "ipfs://bafybeicq6q5ryfn7ancm5cnwg2xzp5pim2m3ndajbsc7le6crkqajkwu7e/mi777_jersey.png"
  }
  
    with open("./json/" + str(x), "w") as outfile:
        json.dump(dictionary, outfile, indent=4)
