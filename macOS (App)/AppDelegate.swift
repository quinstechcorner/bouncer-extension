import SwiftUI
import SafariServices

@main
struct BouncerApp: App {
    var body: some Scene {
        WindowGroup {
            VStack(spacing: 16) {
                Image(systemName: "shield.fill")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 64, height: 64)
                    .foregroundColor(.accentColor)

                Text("Bouncer Safari Extension")
                    .font(.title2)
                    .fontWeight(.bold)

                Text("Bouncer runs directly inside Safari. Click the shield icon in Safari's toolbar or manage settings under Safari Preferences.")
                    .font(.body)
                    .multilineTextAlignment(.center)
                    .foregroundColor(.secondary)
                    .padding(.horizontal)

                Button("Open Safari Extensions Preferences") {
                    SFSafariApplication.showPreferencesForExtension(withIdentifier: "quinstechcorner.bouncer.Extension") { _ in }
                }
                .buttonStyle(.borderedProminent)
                .controlSize(.large)
            }
            .frame(width: 440, height: 280)
            .padding()
        }
    }
}
