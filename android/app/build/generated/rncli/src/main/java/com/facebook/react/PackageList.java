
package com.facebook.react;

import android.app.Application;
import android.content.Context;
import android.content.res.Resources;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainPackageConfig;
import com.facebook.react.shell.MainReactPackage;
import java.util.Arrays;
import java.util.ArrayList;

// @react-native-async-storage/async-storage
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
// @react-native-community/cameraroll
import com.reactnativecommunity.cameraroll.CameraRollPackage;
// @react-native-community/datetimepicker
import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;
// @react-native-community/masked-view
import org.reactnative.maskedview.RNCMaskedViewPackage;
// @react-native-community/netinfo
import com.reactnativecommunity.netinfo.NetInfoPackage;
// @react-native-firebase/app
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
// @react-native-firebase/database
import io.invertase.firebase.database.ReactNativeFirebaseDatabasePackage;
// @react-native-firebase/messaging
import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingPackage;
// react-native-agora
import io.agora.rtc.react.RCTAgoraRtcPackage;
// react-native-cardview
import com.kishanjvaghela.cardview.RNCardViewPackage;
// react-native-document-picker
import io.github.elyx0.reactnativedocumentpicker.DocumentPickerPackage;
// react-native-file-viewer
import com.vinzscam.reactnativefileviewer.RNFileViewerPackage;
// react-native-fs
import com.rnfs.RNFSPackage;
// react-native-gesture-handler
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
// react-native-image-crop-picker
import com.reactnative.ivpusic.imagepicker.PickerPackage;
// react-native-image-picker
import com.imagepicker.ImagePickerPackage;
// react-native-keep-awake
import com.corbt.keepawake.KCKeepAwakePackage;
// react-native-linear-gradient
import com.BV.LinearGradient.LinearGradientPackage;
// react-native-reanimated
import com.swmansion.reanimated.ReanimatedPackage;
// react-native-safe-area-context
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
// react-native-screens
import com.swmansion.rnscreens.RNScreensPackage;
// react-native-search-bar
import org.umhan35.RNSearchBarPackage;
// react-native-vector-icons
import com.oblador.vectoricons.VectorIconsPackage;
// react-native-video
import com.brentvatne.react.ReactVideoPackage;
// react-native-view-pdf
import com.rumax.reactnative.pdfviewer.PDFViewPackage;
// rn-fetch-blob
import com.RNFetchBlob.RNFetchBlobPackage;

public class PackageList {
  private Application application;
  private ReactNativeHost reactNativeHost;
  private MainPackageConfig mConfig;

  public PackageList(ReactNativeHost reactNativeHost) {
    this(reactNativeHost, null);
  }

  public PackageList(Application application) {
    this(application, null);
  }

  public PackageList(ReactNativeHost reactNativeHost, MainPackageConfig config) {
    this.reactNativeHost = reactNativeHost;
    mConfig = config;
  }

  public PackageList(Application application, MainPackageConfig config) {
    this.reactNativeHost = null;
    this.application = application;
    mConfig = config;
  }

  private ReactNativeHost getReactNativeHost() {
    return this.reactNativeHost;
  }

  private Resources getResources() {
    return this.getApplication().getResources();
  }

  private Application getApplication() {
    if (this.reactNativeHost == null) return this.application;
    return this.reactNativeHost.getApplication();
  }

  private Context getApplicationContext() {
    return this.getApplication().getApplicationContext();
  }

  public ArrayList<ReactPackage> getPackages() {
    return new ArrayList<>(Arrays.<ReactPackage>asList(
      new MainReactPackage(mConfig),
      new AsyncStoragePackage(),
      new CameraRollPackage(),
      new RNDateTimePickerPackage(),
      new RNCMaskedViewPackage(),
      new NetInfoPackage(),
      new ReactNativeFirebaseAppPackage(),
      new ReactNativeFirebaseDatabasePackage(),
      new ReactNativeFirebaseMessagingPackage(),
      new RCTAgoraRtcPackage(),
      new RNCardViewPackage(),
      new DocumentPickerPackage(),
      new RNFileViewerPackage(),
      new RNFSPackage(),
      new RNGestureHandlerPackage(),
      new PickerPackage(),
      new ImagePickerPackage(),
      new KCKeepAwakePackage(),
      new LinearGradientPackage(),
      new ReanimatedPackage(),
      new SafeAreaContextPackage(),
      new RNScreensPackage(),
      new RNSearchBarPackage(),
      new VectorIconsPackage(),
      new ReactVideoPackage(),
      new PDFViewPackage(),
      new RNFetchBlobPackage()
    ));
  }
}
