# Known Issues & Future Development

## 🐛 Current Issues (Post-PyPI Publication)

### Workspace Loading Issues
**Status**: Identified, needs investigation  
**Severity**: High  
**Description**: After publishing to PyPI and installing in JupyterLab Desktop, there are issues with:
- Opening workspace properly
- Source view/preview focus management
- Extension initialization in production environment

**Potential Causes**:
- Development vs production environment differences
- Extension loading order in JupyterLab Desktop
- File watcher/focus detection conflicts
- State management during startup

**Next Steps**:
- Test in isolated environment with clean JupyterLab installation
- Debug extension loading sequence
- Review markdown preview toggle logic for production builds
- Check for console errors during workspace initialization

### Preview/Source Toggle Focus Issues
**Status**: Intermittent, needs refinement  
**Severity**: Medium  
**Description**: The source/preview toggle sometimes gets out of sync when multiple markdown files are open
- Button state doesn't always reflect current file mode
- Toggle affects wrong file in some scenarios

**Investigation Areas**:
- `app.shell.currentWidget` reliability
- Widget focus detection timing
- Multiple file tracking logic

## 🔄 Development Environment vs Production

### Differences Observed
- **Development**: Extension works reliably with `jupyter labextension develop`
- **Production**: Issues appear after `pip install` from PyPI
- **Possible Factor**: Build process differences or packaging issues

### Debug Strategy
1. Compare development vs production builds
2. Test installation from local wheel file
3. Check extension loading logs
4. Verify all assets are properly bundled

## 📋 Future Improvements

### High Priority
- [ ] Fix workspace loading issues
- [ ] Improve source/preview toggle reliability
- [ ] Add error handling for startup failures
- [ ] Create diagnostic tools for troubleshooting

### Medium Priority  
- [ ] Performance optimization for large workspaces
- [ ] Better wikilink auto-completion
- [ ] Enhanced search functionality
- [ ] Mobile/responsive design improvements

### Low Priority
- [ ] Themes and customization
- [ ] Advanced PKM features (tags, graph view)
- [ ] Integration with external tools
- [ ] Export/import functionality

## 🔧 Debugging Tools Needed

### Extension Diagnostics
- Add console logging for extension lifecycle
- Create health check command
- Monitor widget focus changes
- Track file opening/closing events

### User Reporting
- Standardized issue template
- System info collection
- Extension version verification
- Conflict detection with other extensions

## 📝 Version History & Issues

### v0.1.0 (Current)
- ✅ Core PKM features working in development
- ❌ Workspace loading issues in production
- ❌ Focus management needs improvement

### v0.1.1 (Planned)
- 🎯 Fix production environment issues
- 🎯 Improve focus detection reliability
- 🎯 Add better error handling

## 🤝 Contributing to Fixes

If you encounter these issues:

1. **Report Details**: Include JupyterLab version, OS, and exact error messages
2. **Console Logs**: Check browser developer tools for errors
3. **Reproduction Steps**: Document exact steps to reproduce issues
4. **Workarounds**: Share any temporary solutions found

## 📞 Support Channels

- **GitHub Issues**: Primary bug reporting
- **Development Branch**: Test fixes before release
- **Documentation**: Keep updated with known workarounds

---

**Note**: This extension is actively developed. While core features work well in development environment, production deployment needs refinement. We appreciate patience and feedback as we improve stability.