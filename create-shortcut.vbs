Option Explicit
DIM elm
DIM lnk

SET elm = CreateObject("wscript.shell")
SET lnk = elm.CreateShortcut("Minecraft-DT.lnk")

lnk.TargetPath = "C:\Program Files (x86)\Minecraft-DT\AppLauncher.hta"
lnk.Description = "Minecraft-DT - https://github.com/gubrus50/Minecraft-DT"
lnk.IconLocation = "C:\Program Files (x86)\Minecraft-DT\app\images\mdt_ico.ico"
lnk.Save