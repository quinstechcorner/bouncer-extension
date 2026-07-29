import SafariServices

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {

    func beginRequest(with context: NSExtensionContext) {
        // Standalone Web Extension: storage handled via chrome.storage.local
        context.completeRequest(returningItems: nil, completionHandler: nil)
    }
}
