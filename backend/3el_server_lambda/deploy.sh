rm el_server_build.zip
zip -r   -X el_server_build.zip . -x "__pycache__/*" *.DStore* *.idea* deploy.sh
mkdir packages
pip install -r requirements.txt --target packages
cd packages
zip -ur ../el_server_build.zip .
cd ..
rm -rf packages
