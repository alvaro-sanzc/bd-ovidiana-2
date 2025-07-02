import subprocess
import os
import shutil


project_path = r".\\prototipo_web"
data_path = r"data"


os.chdir(project_path)


print("Apagando y eliminando contenedores...")
subprocess.run(["docker", "compose", "down"], check=True)


print("Reconstruyendo e iniciando contenedores...")
subprocess.run(["docker", "compose", "up", "--build"], check=True)
