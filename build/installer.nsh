!addplugindir "./Plugins"

!macro preInit
 SetRegView 32
  WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\BarDeMu\app"
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\BarDeMu\app"
!macroend

!macro customInstall
  AccessControl::GrantOnFile \
    "C:\BarDeMu\app" "(S-1-1-0)" "FullAccess"
  Pop $0
  AccessControl::GrantOnFile \
    "$INSTDIR" "(S-1-1-0)" "FullAccess"
  Pop $0
!macroend